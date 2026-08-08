export interface MeshyJob {
  id: string;
  status: string;
  model_urls?: { glb: string; fbx?: string };
  thumbnail_url?: string;
}

export async function createImageTo3DJob(imageUrl: string): Promise<string> {
  const res = await fetch('https://api.meshy.ai/openapi/v2/image-to-3d', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MESHY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: imageUrl,
      ai_model: 'meshy-4',
      topology: 'quad',
      target_polycount: 10000,
      enable_pbr: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meshy image-to-3d failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.result as string;
}

export async function getJob(jobId: string): Promise<MeshyJob> {
  const res = await fetch(`https://api.meshy.ai/openapi/v2/image-to-3d/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.MESHY_API_KEY}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meshy getJob failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<MeshyJob>;
}
