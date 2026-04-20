import prisma from '../prisma.js';

/**
 * Find all ports with optional filtering and pagination
 * @param {Object} filters - { country?, status?, port_role? }
 * @param {Object} pagination - { page, limit }
 * @returns {Promise<{ports: Array, total: number}>}
 */
export const findAllPorts = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  const { country, status, port_role } = filters;
  const { page, limit } = pagination;

  const where = {};
  
  if (country) {
    where.country = {
      contains: country,
      mode: 'insensitive'
    };
  }
  
  if (status) {
    where.status = status.toLowerCase();
  }
  
  if (port_role) {
    where.port_role = port_role.toUpperCase();
  }

  const skip = (page - 1) * limit;

  const [ports, total] = await prisma.$transaction([
    prisma.port.findMany({
      where,
      skip,
      take: limit,
      orderBy: { unlocode: 'asc' }
    }),
    prisma.port.count({ where })
  ]);

  return { ports, total };
};

/**
 * Find a single port by UNLOCODE
 * @param {string} unlocode - Port UNLOCODE (case-insensitive)
 * @returns {Promise<Object|null>}
 */
export const findPortByCode = async (unlocode) => {
  return await prisma.port.findUnique({
    where: {
      unlocode: unlocode.toUpperCase()
    }
  });
};

/**
 * Create a new port
 * @param {Object} portData - { unlocode, country, name, port_role?, status? }
 * @returns {Promise<Object>}
 * @throws {Error} If unique constraint violated or validation fails
 */
export const createPort = async (portData) => {
  const { unlocode, country, name, port_role, status } = portData;
  
  return await prisma.port.create({
    data: {
      unlocode: unlocode.toUpperCase(),
      country,
      name,
      port_role: port_role ? port_role.toUpperCase() : 'DESTINATION',
      status: status ? status.toLowerCase() : 'active'
    }
  });
};

/**
 * Delete a port by UNLOCODE
 * @param {string} unlocode - Port UNLOCODE (case-insensitive)
 * @returns {Promise<Object>} Deleted port record
 * @throws {Error} If port not found
 */
export const deletePort = async (unlocode) => {
  return await prisma.port.delete({
    where: {
      unlocode: unlocode.toUpperCase()
    }
  });
};
