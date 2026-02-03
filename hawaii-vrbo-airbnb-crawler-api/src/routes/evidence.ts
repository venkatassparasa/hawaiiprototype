import { Router } from 'express';

const router = Router();

// GET /api/evidence/:violationId - Get evidence for violation
router.get('/:violationId', (req, res) => {
  res.json({
    evidence: [],
    message: 'Evidence endpoint - placeholder implementation',
  });
});

export default router;
