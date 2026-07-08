import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use a simple client without types for API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_address,
      notes,
      items,
      subtotal,
      discount,
      delivery_fee,
      total,
      coupon_code,
    } = body;

    // Generate order number
    let orderNumber: string;
    try {
      const { data } = await supabase.rpc('generate_order_number');
      orderNumber = data || generateFallbackOrderNumber();
    } catch {
      orderNumber = generateFallbackOrderNumber();
    }

    // Get coupon ID if provided
    let coupon_id: string | null = null;
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('id')
        .eq('code', coupon_code)
        .maybeSingle();

      if (coupon) {
        coupon_id = (coupon as any).id;
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_address,
        notes,
        delivery_fee,
        subtotal,
        discount,
        total,
        coupon_id,
        status: 'pending',
        payment_method: 'whatsapp',
      })
      .select('id, order_number')
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    const orderId = (order as any).id;
    const createdOrderNumber = (order as any).order_number;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      notes: item.notes,
    }));

    const { data: insertedItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select('id');

    // Create order item extras
    if (insertedItems && items) {
      const itemExtras: any[] = [];
      (insertedItems as any[]).forEach((insertedItem: any, idx: number) => {
        const originalItem = items[idx];
        if (originalItem.extras && originalItem.extras.length > 0) {
          originalItem.extras.forEach((extra: any) => {
            itemExtras.push({
              order_item_id: insertedItem.id,
              extra_id: extra.extra_id,
              extra_name: extra.extra_name,
              quantity: extra.quantity,
              unit_price: extra.unit_price,
              total_price: extra.total_price,
            });
          });
        }
      });

      if (itemExtras.length > 0) {
        await supabase.from('order_item_extras').insert(itemExtras);
      }
    }

    // Update coupon usage if used
    if (coupon_id) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('current_uses')
        .eq('id', coupon_id)
        .maybeSingle();

      if (coupon) {
        await supabase
          .from('coupons')
          .update({ current_uses: ((coupon as any).current_uses || 0) + 1 })
          .eq('id', coupon_id);
      }
    }

    return NextResponse.json({
      success: true,
      order_number: createdOrderNumber,
      order_id: orderId,
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

function generateFallbackOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SNK-${timestamp}-${random}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('orders')
    .select(`
      id,
      order_number,
      customer_name,
      customer_phone,
      customer_address,
      delivery_fee,
      subtotal,
      discount,
      total,
      notes,
      status,
      payment_method,
      created_at,
      order_items (
        id,
        product_id,
        product_name,
        quantity,
        unit_price,
        total_price,
        notes,
        order_item_extras (
          extra_name,
          quantity,
          unit_price
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }

  return NextResponse.json({ orders: data });
}
