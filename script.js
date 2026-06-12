document.addEventListener('DOMContentLoaded', () => {
    // 課題文の各行要素
    const taskParts = {
        step1: ['task-part-1'],
        step2: ['task-part-1', 'task-part-2a', 'task-part-2b', 'task-part-2c', 'task-part-2d', 'task-part-2e']
    };

    const allTaskLines = document.querySelectorAll('.task-line');

    // Intersection Observerの設定
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // セクションが30%見えたらアクティブにする
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeStepId = entry.target.id;
                updateTaskHighlight(activeStepId);
            }
        });
    }, observerOptions);

    // 監視対象の設定
    document.querySelectorAll('.step-section').forEach(section => {
        observer.observe(section);
    });

    // 課題文のハイライトを更新する関数
    function updateTaskHighlight(stepId) {
        const activeParts = taskParts[stepId] || [];

        allTaskLines.forEach(line => {
            if (activeParts.includes(line.id)) {
                line.classList.remove('grayed-out');
            } else {
                line.classList.add('grayed-out');
            }
        });
    }

    // デフォルトでステップ1をアクティブにする
    updateTaskHighlight('step1');
});
