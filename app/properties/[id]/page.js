import Property from '@/models/Property';
import dbConnect from '@/lib/dbConnect';
import PropertyDetail from '@/components/PropertyDetails'; // Your client component

export default async function PropertyPage({ params }) {
  const { id } = params;
  await dbConnect();

  // Fetch property with owner data
  const property = await Property.findById(id)
    .populate('owner', 'firstName lastName mobile image')
    .lean(); // Convert to plain JS object

  if (!property) {
    return <div>Property not found</div>;
  }

  // Serialize the data
  const serializedProperty = {
    ...property,
    _id: property._id.toString(),
    owner: property.owner ? {
      ...property.owner,
      _id: property.owner._id.toString()
    } : null
  };

  return <PropertyDetail property={serializedProperty} />;
}