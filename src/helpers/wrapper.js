module.exports = {
  response: (response, status, msg, data, pagination) => {
    const result = {}
    result.status = status
    result.msg = msg
    result.data = data
    result.pagination = pagination

    return response.status(result.status).json(result)
  }
}
