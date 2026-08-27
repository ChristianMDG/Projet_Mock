export default ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {
          folder: 'taxibrousse/cms', // Organize uploads in a folder
          resource_type: 'auto',
          use_filename: true,
          unique_filename: false,
        },
        uploadStream: {
          folder: 'taxibrousse/cms',
          resource_type: 'auto',
        },
        delete: {},
      },
    },
  },
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'fr',
      locales: ['fr', 'en', 'mg'],
    },
  },
});
