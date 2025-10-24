import AdmZip from 'adm-zip'

export const zipUtils = {
  zip(from, to) {
    const admZip = new AdmZip()
    admZip.addLocalFolder(from)
    admZip.writeZip(to)
  },
  unzip(from, to, password = '') {
    const admZip = new AdmZip(from)
    if (password !== '') {
      admZip.extractAllTo(to, true, undefined, password)
    } else {
      admZip.extractAllTo(to, true)
    }
  }
}
