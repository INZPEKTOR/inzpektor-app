import { supabase } from '../lib/supabase';

const POINTS_CONFIG = {
  kyc: 100,
  email: 30,
  facebook: 30,
  government_id: 30,
  biometrics: 30,
  phone: 30,
};

export const pointsService = {
  // Get or create user verification record
  async getOrCreateUserVerification(userId, email) {
    // First try to get existing record
    let { data, error } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No record found, create one
      const { data: newData, error: insertError } = await supabase
        .from('user_verifications')
        .insert({
          user_id: userId,
          email: email,
          total_points: 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }

    if (error) throw error;
    return data;
  },

  // Get user verification data by user ID
  async getUserVerification(userId) {
    const { data, error } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Update verification status and add points
  async updateVerification(userId, verificationType) {
    const columnMap = {
      email: 'email_verified',
      facebook: 'facebook_verified',
      government_id: 'government_id_verified',
      biometrics: 'biometrics_verified',
      phone: 'phone_verified',
    };

    const column = columnMap[verificationType];
    if (!column) throw new Error('Invalid verification type');

    // Get current data
    const { data: current, error: fetchError } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Check if already verified
    if (current[column]) {
      return current; // Already verified, return current data
    }

    // Update verification and add points
    const newPoints = current.total_points + POINTS_CONFIG[verificationType];

    const { data, error } = await supabase
      .from('user_verifications')
      .update({
        [column]: true,
        total_points: newPoints,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get points configuration
  getPointsConfig() {
    return POINTS_CONFIG;
  },

  // Get or create user verification by wallet address (for KYC)
  async getOrCreateByWallet(walletAddress) {
    // First try to get existing record
    let { data, error } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error && error.code === 'PGRST116') {
      // No record found, create one with KYC points
      const { data: newData, error: insertError } = await supabase
        .from('user_verifications')
        .insert({
          wallet_address: walletAddress,
          total_points: POINTS_CONFIG.kyc,
          kyc_verified: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }

    if (error) throw error;

    // Record exists, check if we need to add KYC points
    if (!data.kyc_verified) {
      const { data: updatedData, error: updateError } = await supabase
        .from('user_verifications')
        .update({
          kyc_verified: true,
          total_points: data.total_points + POINTS_CONFIG.kyc,
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', walletAddress)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedData;
    }

    return data;
  },

  // Get user verification by wallet address
  async getByWallet(walletAddress) {
    const { data, error } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Update email verification for a wallet
  async updateEmailVerification(walletAddress, email) {
    // Get current data
    const { data: current, error: fetchError } = await supabase
      .from('user_verifications')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (fetchError) throw fetchError;

    // Already verified
    if (current.email_verified) return current;

    // Update email verification and add points
    const { data, error } = await supabase
      .from('user_verifications')
      .update({
        email: email,
        email_verified: true,
        total_points: current.total_points + POINTS_CONFIG.email,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', walletAddress)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
