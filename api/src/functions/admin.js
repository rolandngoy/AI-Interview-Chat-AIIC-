// POST /api/admin-users — every account, for the site admin only.
// Admins: the verified emails in ADMIN_EMAILS (comma-separated), default rolandngoy@yahoo.com.
const { app } = require('@azure/functions');
const { makeAdminHandler, adminEmails } = require('../admin');
const infra = require('../infra');

const handle = makeAdminHandler({ verifyTokenClaims: infra.verifyTokenClaims, listAllUsers: infra.listAllUsers });

app.http('adminUsers', {
  methods: ['POST'],
  authLevel: 'anonymous', // access is enforced by verifying the Firebase ID token and the admin email
  route: 'admin-users',
  handler: async (request, context) => {
    const out = await handle(request.headers.get('x-firebase-token'), adminEmails(process.env.ADMIN_EMAILS));
    if (out.status >= 500) context.log('admin-users unavailable');
    return { status: out.status, jsonBody: out.body, headers: { 'Cache-Control': 'no-store' } };
  }
});
