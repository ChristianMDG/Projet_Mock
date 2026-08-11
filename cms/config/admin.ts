const getPreviewPathname = (uid: string, { locale, document }: { locale: string; document: { [x: string]: any; id: string | number } }): string | null => {
  const { slug } = document;
  
  switch (uid) {
    case "api::hero-content.hero-content":
      return `/?preview=hero&locale=${locale}`;

    case "api::offer.offer":
      return slug ? `/offers/${slug}` : `/offers?highlight=${document.id}`;

    case "api::payment-method.payment-method":
      return `/payment-preview?method=${document.identifier ?? document.id}`;

    case "api::dynamic-page.dynamic-page":
      return slug ? `/page/${slug}` : `/page/preview/${document.id}`;

    default:
      return null;
  }
};

export default function adminConfig({ env }) {
  const clientUrl = env("CLIENT_URL");
  const previewSecret = env("PREVIEW_SECRET");

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    secrets: {
      encryptionKey: env('ENCRYPTION_KEY'),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: [clientUrl, env("FRONTEND_URL")],
        handler: async (uid, { documentId, locale, status }) => {
          try {
            const document = await strapi.documents(uid).findOne({ documentId });
            if (!document) return null;

            const pathname = getPreviewPathname(uid, { locale, document });
            if (!pathname) return null;

            const urlSearchParams = new URLSearchParams({
              uid: uid,
              url: pathname,
              secret: previewSecret,
              status: status ?? 'draft',
              documentId: documentId,
              locale: locale ?? 'fr',
            });

            return `${clientUrl}/api/preview?${urlSearchParams}`;
          } catch (error) {
            console.error('Preview handler error:', error);
            return null;
          }
        },
      }
    }
  };
};
