const getCurrentUserList = (currentUsers) => {
  const list = []
  for (const key in currentUsers) {
    list.push(currentUsers[key])
  }
  return list
}

module.exports = {
  getCurrentUserList
}