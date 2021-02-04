export function showLoading(chartInstance, loadingText = 'loading...') {
    chartInstance.showLoading({
        text: loadingText,
        color: 'rgba(0, 0, 0, 0.8)',
        maskColor: 'rgba(255, 255, 255, 0.2)',
    });
};

export function hideLoading(chartInstance) {
    chartInstance.hideLoading();
};