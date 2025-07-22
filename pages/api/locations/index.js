import { syriaLocations } from '@/data/syriaLocations';

export default function handler(req, res) {
  res.status(200).json(syriaLocations);
}