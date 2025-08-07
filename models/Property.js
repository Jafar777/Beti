import mongoose from 'mongoose';
if (mongoose.models.Property) {
  delete mongoose.models.Property;
}

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  location: String,
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  propertyType: { type: String, enum: ['apartment', 'villa', 'office', 'land','full_floor' , 'full_building' , 'shop','house','arabian_house','farm','warehouse' , 'seaside_chalet', 'palace','showroom' , 'wedding_hall'], default: 'apartment' },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number },
  pinLocation: {
    lat: { type: Number, default: function() { return this.latitude } },
    lng: { type: Number, default: function() { return this.longitude } }
  },
    contractType: { 
    type: String, 
    enum: ['rent', 'sale', 'mortgage'], 
    required: true,
    default: 'sale'
  },
  ownershipType: {
    type: String,
    enum: [
      'green_deed', 
      'white_deed', 
      'court_decision', 
      'notary', 
      'emiri', 
      'reform', 
      'charitable_endowment', 
      'lineage_endowment'
    ],
    required: true
  },
  likes: { type: Number, default: 0 },
   views: { 
    type: Number, 
    default: 0 
  },
    age: { type: String }, // عمر العقار
  airConditioning: { type: String, enum:['normal_split','inverter_split','central','concealed','window_ac','desert_ac','none'], default: 'none' ,required: true }, // المكيفات
  privateParking: { type: Boolean, default: false }, // موقف سيارات خاص
  entrances: { type: Number, default: 1 }, // عدد مداخل البيت
  electricity: { type: String,enum:['no_electricity','solar_panels','amber_subscription','only_government_electricity'], default: 'only_government_electricity' ,required:true}, // الكهرباء
  water: { type: String, enum:['drinkable','non_drinkable','no_water'] , default:'non_drinkable', required:true }, // المياه
  violations: { type: Boolean, default: false }, // مخالفات
  rooftopOwnership: { type: String,enum:['shared','private',], default: 'shared', required:true }, // ملكية سطح العقار
  video: { type: String },
    governorate: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  status: {
    type: String,
    enum: ['draft', 'active', 'pending', 'sold', 'archived'],
    default: 'draft'
  }
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);