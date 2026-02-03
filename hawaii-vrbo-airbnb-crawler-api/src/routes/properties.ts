import { Router } from 'express';

const router = Router();

// GET /api/properties - List all properties
router.get('/', (req, res) => {
  res.json({
    properties: [],
    message: 'Properties endpoint - placeholder implementation',
  });
});

// GET /api/properties/:id - Get specific property
router.get('/:id', (req, res) => {
  res.json({
    property: null,
    message: 'Property details endpoint - placeholder implementation',
  });
});

export default router;
