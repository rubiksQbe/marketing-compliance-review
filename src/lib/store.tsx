import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createId, nextRequestId } from './id'
import { slaHoursForTier } from './risk'
import {
  loadRequests,
  loadSession,
  resetRequests,
  saveRequests,
  saveSession,
} from './storage'
import type {
  DecisionInput,
  ReviewRequest,
  RiskTier,
  SessionIdentity,
  SubmitInput,
} from './types'

interface StoreValue {
  requests: ReviewRequest[]
  session: SessionIdentity | null
  setSession: (session: SessionIdentity | null) => void
  getRequest: (id: string) => ReviewRequest | undefined
  visibleRequests: ReviewRequest[]
  submitRequest: (input: SubmitInput) => ReviewRequest
  resubmitRequest: (id: string, input: SubmitInput) => ReviewRequest | undefined
  /** Soft-withdraw: retain payload + Activity; hide from active queue. */
  withdrawRequest: (id: string) => void
  decide: (id: string, input: DecisionInput) => ReviewRequest | undefined
  markOpened: (id: string, actor: string) => void
  updateRiskTier: (id: string, tier: RiskTier, actor: string) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ReviewRequest[]>(() => loadRequests())
  const [session, setSessionState] = useState<SessionIdentity | null>(() => loadSession())

  useEffect(() => {
    saveRequests(requests)
  }, [requests])

  const setSession = useCallback((next: SessionIdentity | null) => {
    setSessionState(next)
    saveSession(next)
  }, [])

  const getRequest = useCallback(
    (id: string) => requests.find((r) => r.id === id),
    [requests],
  )

  const visibleRequests = useMemo(() => {
    if (!session) return []
    if (session.role === 'reviewer') return requests
    return requests.filter((r) => r.submitter === session.name)
  }, [requests, session])

  const submitRequest = useCallback(
    (input: SubmitInput) => {
      if (!session || session.role !== 'submitter') {
        throw new Error('Only submitters can create requests')
      }
      const now = new Date().toISOString()
      const created: ReviewRequest = {
        id: nextRequestId(requests.map((r) => r.id)),
        ...input,
        partnerName: input.source === 'affiliate' ? input.partnerName?.trim() : undefined,
        status: 'pending',
        slaHours: slaHoursForTier(input.riskTier),
        submittedAt: now,
        updatedAt: now,
        submitter: session.name,
        events: [
          {
            id: createId('evt'),
            at: now,
            actor: session.name,
            action: 'submitted',
            detail: 'Structured intake complete.',
          },
        ],
      }
      setRequests((prev) => [created, ...prev])
      return created
    },
    [requests, session],
  )

  const resubmitRequest = useCallback(
    (id: string, input: SubmitInput) => {
      if (!session || session.role !== 'submitter') {
        throw new Error('Only submitters can edit requests')
      }
      let updated: ReviewRequest | undefined
      const now = new Date().toISOString()
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== id || req.submitter !== session.name) return req
          updated = {
            ...req,
            ...input,
            partnerName: input.source === 'affiliate' ? input.partnerName?.trim() : undefined,
            status: 'pending',
            slaHours: slaHoursForTier(input.riskTier),
            submittedAt: now,
            updatedAt: now,
            assignee: undefined,
            events: [
              ...req.events,
              {
                id: createId('evt'),
                at: now,
                actor: session.name,
                action: 'resubmitted',
                detail: 'Edited and resubmitted for approval.',
              },
            ],
          }
          return updated
        }),
      )
      return updated
    },
    [session],
  )

  const withdrawRequest = useCallback(
    (id: string) => {
      if (!session || session.role !== 'submitter') return
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== id || req.submitter !== session.name) return req
          if (req.status === 'approved' || req.status === 'withdrawn') return req
          if (req.status !== 'pending' && req.status !== 'changes_requested' && req.status !== 'rejected') {
            return req
          }
          const now = new Date().toISOString()
          return {
            ...req,
            status: 'withdrawn' as const,
            updatedAt: now,
            events: [
              ...req.events,
              {
                id: createId('evt'),
                at: now,
                actor: session.name,
                action: 'withdrawn' as const,
                detail: 'Withdrawn by submitter. Record retained for audit.',
              },
            ],
          }
        }),
      )
    },
    [session],
  )

  const markOpened = useCallback((id: string, actor: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req
        const already = req.events.some((e) => e.action === 'opened' && e.actor === actor)
        if (already) return req
        const now = new Date().toISOString()
        return {
          ...req,
          updatedAt: now,
          assignee: actor,
          events: [...req.events, { id: createId('evt'), at: now, actor, action: 'opened' }],
        }
      }),
    )
  }, [])

  const decide = useCallback((id: string, input: DecisionInput) => {
    let updated: ReviewRequest | undefined
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req
        const now = new Date().toISOString()
        updated = {
          ...req,
          status: input.action === 'approved' ? 'approved' : 'rejected',
          updatedAt: now,
          assignee: input.actor,
          events: [
            ...req.events,
            {
              id: createId('evt'),
              at: now,
              actor: input.actor,
              action: input.action,
              detail: input.detail,
              reasonCodes: input.reasonCodes,
            },
          ],
        }
        return updated
      }),
    )
    return updated
  }, [])

  const updateRiskTier = useCallback((id: string, tier: RiskTier, actor: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id || req.status !== 'pending' || req.riskTier === tier) return req
        const now = new Date().toISOString()
        return {
          ...req,
          riskTier: tier,
          slaHours: slaHoursForTier(tier),
          updatedAt: now,
          assignee: actor,
          events: [
            ...req.events,
            {
              id: createId('evt'),
              at: now,
              actor,
              action: 'risk_updated',
              detail: `Risk set to ${tier} (${slaHoursForTier(tier)}h due window from original submit).`,
            },
          ],
        }
      }),
    )
  }, [])

  const resetDemo = useCallback(() => {
    setRequests(resetRequests())
  }, [])

  const value = useMemo(
    () => ({
      requests,
      session,
      setSession,
      getRequest,
      visibleRequests,
      submitRequest,
      resubmitRequest,
      withdrawRequest,
      decide,
      markOpened,
      updateRiskTier,
      resetDemo,
    }),
    [
      requests,
      session,
      setSession,
      getRequest,
      visibleRequests,
      submitRequest,
      resubmitRequest,
      withdrawRequest,
      decide,
      markOpened,
      updateRiskTier,
      resetDemo,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
