import * as portModel from '../utils/models/portModel.js';

const ok = (res, data, status = 200) => {
  res.status(status).json({ success: true, data });
};

const fail = (res, message, status = 400) => {
  res.status(status).json({ success: false, error: message });
};

export const getAllPorts = async (req, res, next) => {
  try {
    const { country, status, port_role } = req.query;
    const pageNum = Math.max(1, parseInt(req.query.page) || 1);
    const limitNum = Math.max(1, parseInt(req.query.limit) || 10);

    const filters = { country, status, port_role };
    const pagination = { page: pageNum, limit: limitNum };

    const { ports, total } = await portModel.findAllPorts(filters, pagination);

    const totalPages = Math.ceil(total / limitNum);

    ok(res, {
      ports,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPortByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const port = await portModel.findPortByCode(code);

    if (!port) {
      return fail(res, 'Port not found', 404);
    }

    ok(res, { port });
  } catch (error) {
    next(error);
  }
};

export const createPort = async (req, res, next) => {
  try {
    const { unlocode, name, country } = req.body;
    const missing = [];

    if (!unlocode) missing.push('unlocode');
    if (!name) missing.push('name');
    if (!country) missing.push('country');

    if (missing.length > 0) {
      return fail(res, `Missing required fields: ${missing.join(', ')}`);
    }

    const newPort = await portModel.createPort(req.body);
    ok(res, { port: newPort }, 201);
  } catch (error) {
    // Prisma unique constraint violation
    if (error.code === 'P2002') {
      return fail(res, 'Port with this UN/LOCODE already exists', 409);
    }
    next(error);
  }
};

export const deletePort = async (req, res, next) => {
  try {
    const { code } = req.params;
    const removed = await portModel.deletePort(code);
    ok(res, { message: 'Port deleted successfully', port: removed });
  } catch (error) {
    // Prisma record not found
    if (error.code === 'P2025') {
      return fail(res, 'Port not found', 404);
    }
    next(error);
  }
};
