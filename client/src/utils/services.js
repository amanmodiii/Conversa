export const baseUrl = "https://conversa-backend.onrender.com/api";

export const postRequest = async(url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body
    })

    const data = await response.json();
    
    if (!response.ok) {
      let message;
      if (data?.message) message = data.message;
      else message = data;

      return {error: true, message};
    }

    return data;
};

export const getRequest = async(url) => {
    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      let message;
      if (data?.message) message = data.message;
      else message = "An error occured...";

      return { error: true, message };
    }

    return data;
}
