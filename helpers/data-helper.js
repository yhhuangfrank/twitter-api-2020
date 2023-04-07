const getCurrentUserList = (currentUsers) => {
  const list = []
  for (const key in currentUsers) {
    list.push(currentUsers[key])
  }

  // - 依照上線時間加入
  list.sort((a, b) => a.time - b.time)
  return list
}

module.exports = {
  getCurrentUserList
}