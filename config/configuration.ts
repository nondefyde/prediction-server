export const configuration = () => ({
  app: {
    appName: process.env.APP_NAME || 'mpr',
    apikey: process.env.API_KEY || 'matchpredictor',
    serviceName: process.env.SERVICE_NAME || 'Api Service',
    environment: process.env.NODE_ENV || 'development',
    encryption_key: process.env.SERVER_SECRET || 'AppSecret',
    jwt_expiration: process.env.JWT_EXPIRATION || 172800,
    port: process.env.PORT || 7000,
    pagination: {
      itemsPerPage: 10,
    },
    superUser: {
      email: 'admin@gmail.com',
      password: 'password',
    },
    fromEmail:
      process.env.EMAIL_NO_REPLY || process.env.POSTMARK_EMAIL_NO_REPLY,
    defaultVerifyCode: '123456',
    rabbitMQ: process.env.RABBIT_MQ_URL || 'amqp://localhost:5672',
    redisUrl: process.env.REDIS_SERVER_HOST_URL,
    lang: 'en',
    defaultMessageBroker: 'redis',
    redis: {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_SERVER_HOST_URL,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    },
    mongodb: {
      url: process.env.DB_URL,
      test: process.env.DB_TEST_URL,
    },
    rdbms: {
      default: 'postgres',
      postgres: {
        host: process.env.POSTGRES_DB_HOST,
        port: process.env.POSTGRES_DB_PORT,
        name: process.env.POSTGRES_DB_NAME,
        username: process.env.POSTGRES_DB_USERNAME,
        password: process.env.POSTGRES_DB_PASSWORD,
      },
    },
    templates: {
      email: {
        verify: 'verify',
        passwordReset: 'password-reset',
        welcome: 'welcome',
        staff: 'staff-welcome',
        staffReset: 'staff-reset-password',
        otp: 'otp',
        support: 'support',
        customer: 'customer-otp',
        orderConfirmation: 'order-confirmation',
        orderCompletion: 'order-completion',
        orderReady: 'order-ready',
      },
      sms: {
        verify: 'verify',
      },
    },
    payments: {
      paystack: {
        apiKey: process.env.PAYSTACK_SECRET_KEY,
        secret_key: process.env.PAYSTACK_SECRET_KEY,
        chargesPercentage: 2,
      },
    },
    modules: ['Order', 'Menu', 'Transaction'],
    social: {
      github: {
        apiKey: process.env.GITHUB_CLIENT_ID || '',
        secretKey: process.env.GITHUB_CLIENT_SECRET || '',
      },
      facebook: {
        GraphUrl:
          'https://graph.facebook.com/v2.12/me?fields=email,first_name,last_name,picture',
        apiKey: process.env.FACEBOOK_CLIENT_ID,
        testAccessToken: process.env.FB_ACCESS_TOKEN,
        testEmail: process.env.FB_TEST_EMAIL,
        testSocialId: process.env.FB_TEST_ID,
      },
      google: {
        url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
        clientId: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_SECRET_ID,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        testEmail: process.env.GOOGLE_TEST_EMAIL,
        testSocialId: process.env.GOOGLE_TEST_ID,
      },
    },
  },
  worker: {
    port: process.env.PORT || 7000,
    rabbitMQ: process.env.RABBIT_MQ_URL || 'amqp://localhost:5672',
    redisUrl: process.env.REDIS_SERVER_HOST_URL,
    fileUpload: {
      default: process.env.DEFAULT_STORAGE || 'gcs',
      gcs: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFile: process.env.GOOGLE_CLOUD_KEYFILE,
        bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
      },
      s3: {
        key: process.env.AWS_ACCESS_KEY,
        secret: process.env.AWS_SECRET_KEY,
        bucket: process.env.AWS_BUCKET,
        region: process.env.AWS_REGION,
      },
    },
    termii: {
      url: process.env.TERMI_API_URL,
      apikey: process.env.TERMI_API_KEY,
      secretkey: process.env.TERNMII_SECRET_KEY,
      senderId: process.env.TERMII_SENDER_ID,
    },
    email: {
      noReply: { email: 'no-reply@getkassh.com', name: 'getKassh' },
      mailOption: 'sendgrid',
      sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
        contactFormRecipient: process.env.CONTACT_FORM_EMAIL_RECIPIENT,
      },
      postmark: {
        apiKey: process.env.POSTMARK_API_KEY,
        url: process.env.POSTMARK_BASE_URL,
      },
    },
    pusher: {
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER || 'us3',
      useTLS: true,
    },
    workerServiceToken: process.env.WORKER_SERVICE_TOKEN,
  },
  admin: {
    port: process.env.PORT || 7000,
    superUser: {
      email: process.env.ADMIN_EMAIL || 'ekaruztest@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'password',
    },
  },
  data: {
    paymentOption: ['paystack', 'rave', 'bank-transfer', 'card', 'cash'],
  },
});
