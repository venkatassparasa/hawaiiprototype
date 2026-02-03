import { Router } from 'express';

const router = Router();

// POST /api/webhooks/violations - Handle violation webhooks
router.post('/violations', (req, res) => {
  res.json({
    message: 'Webhook received - placeholder implementation',
  });
});

export default router;
