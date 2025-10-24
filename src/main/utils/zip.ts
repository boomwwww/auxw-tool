import AdmZip from 'adm-zip'

export const zipUtils = {
  zip(from: string, to: string) {
    const admZip = new AdmZip()
    admZip.addLocalFolder(from)
    admZip.writeZip(to)
  },
  unzip(from: string, to: string, password: string = '') {
    const admZip = new AdmZip(from)
    if (password !== '') {
      admZip.extractAllTo(to, true, undefined, password)
    } else {
      admZip.extractAllTo(to, true)
    }
  }
}
