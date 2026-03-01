export function leadNotificationTemplate(input: {
  name: string;
  email: string;
  message: string;
  createdAt: string;
}) {
  return {
    subject: `New lead from ${input.name}`,
    text: `New lead\nName: ${input.name}\nEmail: ${input.email}\nMessage: ${input.message}\nCreated: ${input.createdAt}`,
    html: `
      <div style="font-family:Poppins,Arial,sans-serif;background:#0d0d0f;color:#f2f0eb;padding:24px;">
        <h2 style="margin:0 0 16px 0;">New Lead Submitted</h2>
        <p><strong>Name:</strong> ${input.name}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        <p><strong>Message:</strong> ${input.message}</p>
        <p><strong>Created:</strong> ${input.createdAt}</p>
      </div>
    `
  };
}

export function publishNotificationTemplate(input: {
  type: "post" | "work";
  title: string;
  slug: string;
  publishedAt: string;
}) {
  return {
    subject: `${input.type === "post" ? "Post" : "Work"} published: ${input.title}`,
    text: `${input.type} published\nTitle: ${input.title}\nSlug: ${input.slug}\nPublished: ${input.publishedAt}`,
    html: `
      <div style="font-family:Poppins,Arial,sans-serif;background:#0d0d0f;color:#f2f0eb;padding:24px;">
        <h2 style="margin:0 0 16px 0;">${input.type === "post" ? "Post" : "Work"} Published</h2>
        <p><strong>Title:</strong> ${input.title}</p>
        <p><strong>Slug:</strong> ${input.slug}</p>
        <p><strong>Published:</strong> ${input.publishedAt}</p>
      </div>
    `
  };
}
