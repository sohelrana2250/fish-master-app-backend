import { TContract } from './contract.interface';
import database from '../../DB/database';
import ApiError from '../../app/error/ApiError';
import httpStatus from 'http-status';
import FirebaseQueryBuilder from '../../app/builder/QueryBuilder';
import { FieldValue } from 'firebase-admin/firestore';
import formatTimestamps from '../../utility/formatTimestamps/formatTimestamps';

const createContractIntoDb = async (payload: TContract) => {
  try {
    const now = new Date();
    const data = {
      ...payload,
      isfavorite: payload.isfavorite ?? false,
      isDelete: false,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await database.contractCollection().add(data);

    return (
      docRef && {
        id: docRef.id,
        status: true,
        message: 'Contract created successfully',
      }
    );
  } catch (error: any) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'create contruct interbal server error',
      error,
    );
  }
};

const getAllConstructsIntoDb = async (
  queryParams: Record<string, unknown> = {},
) => {
  const queryBuilder = new FirebaseQueryBuilder<any>(
    database.contractCollection(),
    queryParams,
  );

  const constructsData = await queryBuilder
    .filter() // Apply any filters from query params
    .sort() // Apply sorting
    .paginate() // Apply pagination
    .execute(); // Execute the query and get results

  // Get pagination info if needed
  const paginationInfo = await queryBuilder.countTotal();

  return {
    meta: paginationInfo,
    data: constructsData,
  };
};

const findByTheSpecificontractIntoDb = async (id: string) => {
  try {
    const contractRef = database.contractCollection().doc(id);

    const contractDoc = await contractRef.get();

    if (!contractDoc.exists) {
      return {
        success: false,
        message: `Contract with ID ${id} not found`,
        data: null,
      };
    }
    const contractData = contractDoc.data();

    const result = formatTimestamps(contractData);

    return result;
  } catch (error) {
    console.error('Error finding contract:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
      data: null,
    };
  }
};

// write a update _ code

/**
 * Updates a contract document in Firestore
 * @param id The ID of the contract to update
 * @param payload The data to update
 * @returns Object with operation result details
 */
/**
 * Updates a contract document in Firestore
 * @param id The ID of the contract to update
 * @param payload The data to update
 * @returns Object with operation result details
 */
const updateConstructsIntoDb = async (
  id: string,
  payload: Partial<TContract>,
) => {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Contract ID is required',
        data: { id },
      };
    }

    const contractRef = database.contractCollection().doc(id);

    // Check if document exists
    const docSnapshot = await contractRef.get();
    if (!docSnapshot.exists) {
      throw new ApiError(httpStatus.NOT_FOUND, '', '');
    }

    const updateData = {
      ...payload,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Perform the update
    const result = await contractRef.update(updateData);

    return result && { status: true, message: 'Successfully Updated Contract' };
  } catch (error: any) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'updated contract internal server error',
      '',
    );
  }
};

/**

 *
 * @param id The ID of the contract to delete
 * @param hardDelete Whether to completely remove the document (default: false)
 * @returns Object with operation result details
 */
const deleteConstructsIntoDb = async (id: string) => {
  try {
    if (!id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Contract ID is required', '');
    }

    const contractRef = database.contractCollection().doc(id);
    const docSnapshot = await contractRef.get();

    if (!docSnapshot.exists) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Contract with ID ${id} does not exist.`,
        '',
      );
    }

    await contractRef.delete();

    return {
      success: true,
      message: `Contract with ID ${id} deleted successfully.`,
      data: { id },
    };
  } catch (error: any) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'contract seccion internal server error',
      '',
    );
  }
};

export const ContractService = {
  createContractIntoDb,
  getAllConstructsIntoDb,
  findByTheSpecificontractIntoDb,
  updateConstructsIntoDb,
  deleteConstructsIntoDb,
};
