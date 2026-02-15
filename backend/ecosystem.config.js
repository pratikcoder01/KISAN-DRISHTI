// ecosystem.config.js
// PM2 Process Manager Configuration for KISAN-DRISHTI Backend

module.exports = {
  apps: [
    {
      name: 'kisan-drishti-api',
      script: 'dist/server.js',
      
      // Clustering
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3000,
      },
      
      // Logging
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Resource limits
      max_memory_restart: '500M',
      
      // Restart behavior
      autorestart: true,
      watch: false, // Disable in production
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      
      // Advanced features
      listen_timeout: 10000,
      kill_timeout: 5000,
      wait_ready: true,
      
      // Performance monitoring
      instance_var: 'INSTANCE_ID',
      
      // Graceful shutdown
      shutdown_with_message: true,
    },
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'nodejs',
      host: ['server1.kisan-drishti.gov.in'],
      ref: 'origin/main',
      repo: 'git@github.com:kisan-drishti/backend.git',
      path: '/var/www/kisan-drishti-api',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
    staging: {
      user: 'nodejs',
      host: ['staging.kisan-drishti.gov.in'],
      ref: 'origin/develop',
      repo: 'git@github.com:kisan-drishti/backend.git',
      path: '/var/www/kisan-drishti-api-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
    },
  },
};
