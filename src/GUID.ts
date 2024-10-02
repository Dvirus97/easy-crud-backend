export const GUID = {
  new: () => {
    const url = URL.createObjectURL(new Blob());
    return url.substring(14);
  },
};
