export const dynamic = 'force-dynamic';
import Property from '@/models/Property';
import User from '@/models/User'; // Add this import
import dbConnect from '@/lib/dbConnect';
import PropertyDetail from '@/components/PropertyDetails';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function PropertyPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  await dbConnect();

  // Fetch property
  const property = await Property.findById(id)
    .populate('owner', 'firstName lastName mobile image')
    .select('+likes')
    .lean();

  if (!property) {
    return <div>Property not found</div>;
  }

  // Check if current user has liked this property by querying database directly
  let isLikedByCurrentUser = false;
  if (session?.user?.id) {
    const user = await User.findById(session.user.id).select('likedProperties');
    if (user) {
      isLikedByCurrentUser = user.likedProperties.some(
        likedId => likedId.toString() === property._id.toString()
      );
    }
  }

  const isOwner = session?.user?.id === property.owner?._id?.toString();

  // Increment view count only for non-owners
  if (!isOwner) {
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
    property.views = (property.views || 0) + 1;
  }

  const serializedProperty = {
    ...property,
    _id: property._id.toString(),
    contractType: property.contractType,
    ownershipType: property.ownershipType,
    owner: property.owner ? {
      ...property.owner,
      _id: property.owner._id.toString(),
      id: property.owner._id.toString()
    } : null
  };

  return (
    <PropertyDetail
      property={serializedProperty}
      isLikedByCurrentUser={isLikedByCurrentUser}
    />
  );
}