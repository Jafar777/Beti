
 import Property from '@/models/Property';
 import dbConnect from '@/lib/dbConnect';
import PropertyDetail from '@/components/PropertyDetails';

 export default async function PropertyPage({ params }) {
   // Await the dynamic `params` API first…
   const { id } = await params;

    await dbConnect();

    const property = await Property.findById(id)
      .populate('owner', 'firstName lastName mobile image')
      .lean();

    if (!property) {
      return <div>Property not found</div>;
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

    return <PropertyDetail property={serializedProperty} />;
  }
