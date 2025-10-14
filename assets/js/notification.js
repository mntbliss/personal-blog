
document.querySelector('.subscribe').addEventListener('click', () => {
	const emailInput = document.querySelector('input[type="email"]');
	const email = emailInput.value.trim();

	if (!email || !email.includes('@')) {
		NotificationService.Notify('Please enter a valid email ✨💌', "rgba(80,20,180,0.35)");
		return;
	}

	fetch(`https://eepywitches.cloud/api/v0/watchlist.php?email=${email}`, { redirect: "follow" }).then(response => {
		if (response.ok) {
			NotificationService.Notify('Thanks for subscribing! We will notify you by email when platform will be publicly released. Use this email to register or a google services registered to this email to get your gifts! 🌿🍃', "rgba(20,200,20,0.35)");
			emailInput.value = '';
		} else {
			NotificationService.Notify('You already in the watchlist, or perhaps something went wrong? 😥💔', "rgba(220,20,20,0.35)");
		}
	});
});


class NotificationService {
	static Notify(messageText, backgroundColor = "rgba(0,0,0,0.45)", durationMs = 5000) {
		const notificationRoot = document.getElementById("notif-root");
		if (!notificationRoot) throw new Error("notif-root not found");
	
		const notificationElement = document.createElement("div");
		notificationElement.className = "notif";
		notificationElement.style.background = backgroundColor;
		notificationElement.textContent = messageText;
	
		notificationElement.addEventListener("click", () => NotificationService.RemoveNotification(notificationElement));
	
		if (durationMs && durationMs > 0) {
		setTimeout(() => NotificationService.RemoveNotification(notificationElement), durationMs);
		}
	
		notificationRoot.prepend(notificationElement);
		return notificationElement;
	}
	
	static RemoveNotification(notificationElement) {
		if (!notificationElement || notificationElement.dataset.removing) return;
		notificationElement.dataset.removing = "true";
	
		const handleAnimationEnd = (event) => {
		if (event.target !== notificationElement) return;
		notificationElement.removeEventListener("animationend", handleAnimationEnd);
		if (notificationElement.parentNode) notificationElement.parentNode.removeChild(notificationElement);
		};
	
		notificationElement.addEventListener("animationend", handleAnimationEnd);
	
		// Trigger fadeOut animation
		notificationElement.style.animation = "fadeOut .28s ease-in forwards";
	
		// Safety fallback
		setTimeout(() => {
		if (document.body.contains(notificationElement)) notificationElement.remove();
		}, 1200);
	}
}