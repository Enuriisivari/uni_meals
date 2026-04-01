// Dummy report generator utility
export const generateReport = (data, type = "PDF") => {
  console.log(`Generating ${type} report...`);
  return `This is a generic ${type} report based on provided data length of ${data?.length || 0}.`;
};
