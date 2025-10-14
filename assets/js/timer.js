
    const countdownElement = document.getElementById('countdown');

    const launchDate = new Date("2025-12-01T00:00:00").getTime();

    const updateCountdown = () => {
      if(countdownElement == undefined) return;
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        countdownElement.textContent = "We're launching soon..";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.textContent = 
        `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    };

    setInterval(updateCountdown, 1000);
    updateCountdown(); 