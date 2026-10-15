// Offline / no-backend fallback store.
//
// The app talks to the Express + MongoDB backend when it is reachable.
// When it is not (for example the site is deployed as a static frontend only,
// or the backend is not running locally), applications are saved in the
// browser so that submitting a form never fails with "Something went wrong".

import { DOCUMENT_KEYS } from "../config/documents";

const KEY = "localLoanApplications";
const MAX_INLINE_FILE = 1.5 * 1024 * 1024; // keep localStorage usage sane

export const isOffline = (err) => !err?.response;

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
};

const fileToRecord = (file) =>
  new Promise((resolve) => {
    if (!file) return resolve("");
    if (file.size > MAX_INLINE_FILE) return resolve(file.name);
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || file.name));
    reader.onerror = () => resolve(file.name);
    reader.readAsDataURL(file);
  });

export async function saveLocalApplication(formData, files) {
  const docs = {};
  for (const key of DOCUMENT_KEYS) {
    docs[key] = await fileToRecord(files?.[key]);
  }

  const record = {
    _id: `local-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    fullName: String(formData.fullName || "").trim(),
    phone: String(formData.phone || "").trim(),
    email: String(formData.email || "").trim(),
    loanType: String(formData.loanType || "").trim(),
    loanAmount: Number(formData.loanAmount) || 0,
    ...docs,
    createdAt: new Date().toISOString(),
    storedLocally: true,
  };

  const list = read();
  list.unshift(record);
  if (!write(list)) {
    // Storage full: drop inline documents and keep the record itself.
    const light = { ...record };
    for (const key of DOCUMENT_KEYS) {
      if (String(light[key]).startsWith("data:")) light[key] = files?.[key]?.name || "";
    }
    write([light, ...read()]);
  }
  return record;
}

export const listLocalApplications = () => read();

export const getLocalApplication = (id) => read().find((item) => item._id === id) || null;

export const deleteLocalApplication = (id) => write(read().filter((item) => item._id !== id));
