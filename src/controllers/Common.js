export const buildFailureResponse = (res, e) => {
    console.log(e);
    res.status(222)
        .json({
            status: 'failure',
            error: {
                message: e.message,
                stack: e.stack
            }
        })
};
