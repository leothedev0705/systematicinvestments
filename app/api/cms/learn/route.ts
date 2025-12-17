import { NextRequest, NextResponse } from "next/server";
import { getLearnContent, setLearnContent, type LearnContent } from "@/lib/kv";

// GET all content
export async function GET() {
  try {
    const data = await getLearnContent();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching learn content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// POST new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await getLearnContent();
    
    const newContent: LearnContent = {
      ...body,
      id: Date.now().toString(),
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date().toISOString(),
    };
    
    data.content.unshift(newContent);
    await setLearnContent(data);
    
    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error("Error creating learn content:", error);
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}

// PUT update existing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const data = await getLearnContent();
    const index = data.content.findIndex((c) => c.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    
    data.content[index] = { ...data.content[index], ...updateData };
    await setLearnContent(data);
    
    return NextResponse.json(data.content[index]);
  } catch (error) {
    console.error("Error updating learn content:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    
    const data = await getLearnContent();
    data.content = data.content.filter((c) => c.id !== id);
    await setLearnContent(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting learn content:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}



