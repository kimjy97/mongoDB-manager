import AddDocumentModal from "@components/Modal/AddDocumentModal";
import CopyDocumentModal from "@components/Modal/CopyDocumentModal";
import CreateCollectionModal from "@components/Modal/CreateCollectionModal";
import DeleteCollectionModal from "@components/Modal/DeleteCollectionModal";
import DeleteConfirmModal from "@components/Modal/DeleteConfirmModal";

const Modal = {
  DeleteCollection: DeleteCollectionModal,
  CreateCollection: CreateCollectionModal,
  CopyDocument: CopyDocumentModal,
  DeleteDocument: DeleteConfirmModal,
  AddDocument: AddDocumentModal,
}

export default Modal;