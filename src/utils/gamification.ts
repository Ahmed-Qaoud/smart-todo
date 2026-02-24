import confetti from 'canvas-confetti';

export const triggerCompletionConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#7c3aed', '#00f0ff', '#2ced71']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#7c3aed', '#00f0ff', '#2ced71']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
};

export const calculatePointsForTask = (priorityScore: number, hasSubtasks: boolean) => {
    let points = 10; // Base points

    if (priorityScore > 80) points += 20; // High priority bonus
    if (hasSubtasks) points += 15; // Complexity bonus

    return points;
};
