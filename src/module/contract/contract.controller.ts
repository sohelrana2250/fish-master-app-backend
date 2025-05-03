import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';

import sendRespone from '../../utility/sendRespone';
import httpStatus from 'http-status';
import { ContractService } from './contract.services';

const createContract: RequestHandler = catchAsync(async (req, res) => {
  const result = await ContractService.createContractIntoDb(req.body);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Sucessfulled Added Contract',
    data: result,
  });
});

const getAllConstructs: RequestHandler = async (req, res) => {
  const result = await ContractService.getAllConstructsIntoDb(req.query);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Sucessfulled Find All Contract',
    data: result,
  });
};

const findByTheSpecificontract: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await ContractService.findByTheSpecificontractIntoDb(
      req.params.id,
    );
    sendRespone(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Sucessfulled Find Al By The Specific Contract',
      data: result,
    });
  },
);

const updateConstructs: RequestHandler = catchAsync(async (req, res) => {
  const result = await ContractService.updateConstructsIntoDb(
    req.params.id,
    req.body,
  );
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Sucessfulled  Updated Contract',
    data: result,
  });
});

const deleteConstructs: RequestHandler = catchAsync(async (req, res) => {
  const result = await ContractService.deleteConstructsIntoDb(req.params.id);
  sendRespone(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sucessfulled  Delete Contract',
    data: result,
  });
});

export const ContractController = {
  createContract,
  getAllConstructs,
  findByTheSpecificontract,
  updateConstructs,
  deleteConstructs,
};
