import { withAuthMiddleware } from '@/middlewares/auth.middleware'

import { chain } from '@/middlewares/chain'
import { withI18nMiddleware } from '@/middlewares/locale.middleware'

export default chain([withAuthMiddleware, withI18nMiddleware])

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}
