export const gameEnd = (userid, payload, socket) => {
    const { score } = payload;
    socket.emit('gameEnd', { userid, score })
    
    return { status: 'success' };
}