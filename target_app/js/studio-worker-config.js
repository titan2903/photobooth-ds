(function (global) {
  const DEFAULT_WORKER_URL = "https://supabaseguard.photobooth-io.workers.dev";
  const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);

  function isSafeWorkerUrl(candidate) {
    if (typeof candidate !== "string") {
      return false;
    }

    const trimmed = candidate.trim();
    if (!trimmed) {
      return false;
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "https:") {
        return true;
      }
      return parsed.protocol === "http:" && LOCAL_HOSTS.has(parsed.hostname);
    } catch (error) {
      return false;
    }
  }

  function getStudioModeWorkerUrl() {
    const override = localStorage.getItem("studioModeWorkerUrl");
    const candidate = (override || DEFAULT_WORKER_URL).trim();
    return isSafeWorkerUrl(candidate) ? candidate : DEFAULT_WORKER_URL;
  }

  global.StudioModeConfig = {
    DEFAULT_WORKER_URL,
    getWorkerUrl: getStudioModeWorkerUrl,
  };
})(window);
