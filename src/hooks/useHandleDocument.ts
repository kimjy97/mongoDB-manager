import { refreshDocumentsState } from "@/atoms/document"
import { useApi } from "@/services/api"
import { useRecoilState } from "recoil";

export const useHandleDocument = () => {
  const [, setRefresh] = useRecoilState(refreshDocumentsState);
  const { apiPost } = useApi();


  const handleCopyDocument = async (document: any[], collectionName: string) => {
    await apiPost('/api/documents', {
      document,
      collectionName,
    })
      .then(() => setTimeout(() => setRefresh(true), 1))
      .catch((error) => {
        throw new Error(error);
      })
  }

  const handleAddDocument = async (document: any[], collectionName: string) => {
    await apiPost('/api/documents', {
      document,
      collectionName,
    })
      .then(() => setTimeout(() => setRefresh(true), 1))
      .catch((error) => {
        throw new Error(error);
      })
  }

  const handleDeleteDocument = async (collectionName: string, document: Object) => {
    await apiPost('/api/documents/delete', {
      collectionName,
      document,
    })
      .then(() => setTimeout(() => setRefresh(true), 1))
      .catch((error) => {
        throw new Error(error);
      })
  }

  const handleModifyDocument = async (collectionName: string, document: Object, modifiedDocument: Object) => {
    await apiPost('/api/documents/modify', {
      collectionName,
      document,
      modifiedDocument
    })
      .then(() => setTimeout(() => setRefresh(true), 1))
      .catch((error) => {
        throw new Error(error);
      })
  }

  return {
    handleCopyDocument,
    handleDeleteDocument,
    handleModifyDocument,
    handleAddDocument,
  }
}