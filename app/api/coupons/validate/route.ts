import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      console.error('Coupon validation error:', error);
      return NextResponse.json(
        { valid: false, message: 'Failed to validate coupon' },
        { status: 500 }
      );
    }

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: 'Invalid coupon code' },
        { status: 200 }
      );
    }

    const couponData = coupon as any;

    // Check if coupon is still valid
    const now = new Date();
    const validFrom = new Date(couponData.valid_from);
    const validUntil = couponData.valid_until ? new Date(couponData.valid_until) : null;

    if (now < validFrom) {
      return NextResponse.json(
        { valid: false, message: 'Coupon is not yet active' },
        { status: 200 }
      );
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json(
        { valid: false, message: 'Coupon has expired' },
        { status: 200 }
      );
    }

    // Check usage limit
    if (couponData.max_uses && couponData.current_uses >= couponData.max_uses) {
      return NextResponse.json(
        { valid: false, message: 'Coupon has reached its usage limit' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: couponData.id,
        code: couponData.code,
        discount_type: couponData.discount_type,
        discount_value: couponData.discount_value,
        min_order_amount: couponData.min_order_amount,
      },
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
