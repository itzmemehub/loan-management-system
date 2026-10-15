// The documents an application asks for. `key` matches the upload field
// name and the LoanApplication model in the backend.
export const DOCUMENTS = [
  { key: "aadhaar", title: "Aadhaar card", hint: "Front and back in one file" },
  { key: "pan", title: "PAN card", hint: "Clear photo or scan" },
  { key: "salarySlip", title: "Salary slip", hint: "Your latest month" },
  { key: "bankStatement", title: "Bank statement", hint: "The last six months" },
  { key: "photo", title: "Photograph", hint: "Recent, plain background" },
];

export const DOCUMENT_KEYS = DOCUMENTS.map((doc) => doc.key);

export const ACCEPTED_FILE_TYPES = ".pdf,.jpg,.jpeg,.png";

export const countAttached = (record) => DOCUMENT_KEYS.filter((key) => record?.[key]).length;
