import { NextRequest, NextResponse } from "next/server";
import { getUpdates, setUpdates, type Update } from "@/lib/kv";

// GET all updates
export async function GET() {
  try {
    const updates = await getUpdates();
    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error fetching updates:", error);
    return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 });
  }
}

// POST new update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updates = await getUpdates();
    
    const newUpdate: Update = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    updates.unshift(newUpdate);
    await setUpdates(updates);
    
    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error("Error creating update:", error);
    return NextResponse.json({ error: "Failed to create update" }, { status: 500 });
  }
}

// PUT update existing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const updates = await getUpdates();
    const index = updates.findIndex((u) => u.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }
    
    updates[index] = { ...updates[index], ...updateData };
    await setUpdates(updates);
    
    return NextResponse.json(updates[index]);
  } catch (error) {
    console.error("Error updating update:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE update
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const updates = await getUpdates();
    const filtered = updates.filter((u) => u.id !== id);
    await setUpdates(filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting update:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}



