// Keep-alive cron job to prevent Supabase from pausing due to inactivity
// Runs every Wednesday at 2 AM UTC

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = "https://hakpovxojqxdwesuufsl.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhha3BvdnhvanF4ZHdlc3V1ZnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDk5NTEsImV4cCI6MjA4MDE4NTk1MX0.T22m8CaNEYOltxQs7ZVjhUtNmKbruTHGMn47Mu2sqtk";
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Keep-alive cron started at:', new Date().toISOString());

    const queries = [
      supabase.from('users_info').select('id', { count: 'exact', head: true }),
      supabase.from('transactions').select('id', { count: 'exact', head: true }),
      supabase.from('admin_transactions').select('id', { count: 'exact', head: true }),
    ];

    const results = await Promise.all(queries);

    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Keep-alive errors:', errors);
      return res.status(500).json({
        success: false,
        message: 'Some queries failed',
        errors: errors.map(e => e.error.message),
        timestamp: new Date().toISOString()
      });
    }

    console.log('Keep-alive cron completed successfully');

    return res.status(200).json({
      success: true,
      message: 'Database keep-alive successful',
      timestamp: new Date().toISOString(),
      counts: {
        users: results[0].count,
        transactions: results[1].count,
        admin_transactions: results[2].count
      }
    });

  } catch (error) {
    console.error('Keep-alive cron error:', error);
    return res.status(500).json({
      success: false,
      message: 'Keep-alive failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
