import { notFound } from "next/navigation";
import { getPostForEdit } from "@/app/actions/admin";
import EditPostForm from "./edit-form";

interface Props { params: Promise<{ slug: string }> }

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostForEdit(slug);
  if (!post) notFound();
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">Edit Post</h1>
        <p className="text-sm text-white/58 font-mono">/{slug}</p>
      </div>
      <EditPostForm post={post} />
    </div>
  );
}
