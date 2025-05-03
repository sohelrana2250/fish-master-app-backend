import express from 'express';
import { ContractController } from './contract.controller';
import validationRequest from '../../middleware/validationRequest';
import { ContractValidation } from './contract.zod.validation';

const router= express.Router();

router.post('/',validationRequest(ContractValidation.ContractValidationSchema),ContractController.createContract);
router.get("/find_all_contract",ContractController.getAllConstructs);
router.get("/find_by_specific_contract/:id",ContractController.findByTheSpecificontract);
router.patch("/update_contract/:id",ContractController.updateConstructs);
router.delete("/delete_contract/:id", ContractController.deleteConstructs)
export const ContructRouter=router;