
export default  function generateUniqueId() {
    const timestamp = Date.now(); // Current timestamp
    const randomStr = Math.random().toString(36).substr(2, 9); // Random string

    // Combine timestamp and random string
    const uniqueId = `${timestamp}-${randomStr}`;

    return uniqueId;
  }

