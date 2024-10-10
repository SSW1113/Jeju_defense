export const gameEnd = (uuid, payload) => {
    // 클라이언트는 게임 종료 시 총 점수를 전달
    const { FinalScore } = payload;
    const stages = getStage(uuid);

    if (!stages.length) {
        return { status: 'fail', message: 'No stages found for use' };
    }

    return { status: 'success', message: 'Game ended', FinalScore };
};