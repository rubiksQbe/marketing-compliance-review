import type { AssetType } from './types'
import { creativePacketCopy, missingCreativeErrors } from './creativePacket'

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

const banner = creativePacketCopy('banner')
assert(banner.fileLabel.toLowerCase().includes('creative'), 'banner file label')
assert(banner.bodyLabel.toLowerCase().includes('accompanying'), 'banner body label')
assert(banner.bodyHelp.toLowerCase().includes('caption'), 'banner body help mentions caption')

const email = creativePacketCopy('email')
assert(/screenshot|html/i.test(email.fileLabel), 'email file label')
assert(/exact/i.test(email.bodyLabel), 'email body label')

const landing = creativePacketCopy('landing_page')
assert(/page capture|capture/i.test(landing.fileLabel), 'landing file label')

assert(
  missingCreativeErrors({ assetType: 'banner', body: '' }).length >= 2,
  'banner missing both',
)
assert(
  missingCreativeErrors({ assetType: 'email', creativeImage: 'data:image/png;base64,xx', body: 'Hi' })
    .length === 0,
  'email complete',
)
assert(
  missingCreativeErrors({ assetType: 'landing_page', body: 'Copy' }).some((e) =>
    /capture|screenshot|image|file/i.test(e),
  ),
  'landing missing capture',
)

console.log('creativePacket checks passed')
