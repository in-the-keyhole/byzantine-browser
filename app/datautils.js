/** 
Copyright 2018 Keyhole Software LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


var generateBlockHash = async function (header) {
    let headerAsn = asn.define('headerAsn', function () {
        this.seq().obj(this.key('Number').int(),
            this.key('PreviousHash').octstr(), this.key('DataHash').octstr());
    });
    let output = headerAsn.encode({
        Number: parseInt(header.number),
        PreviousHash: Buffer.from(header.previous_hash, 'hex'),
        DataHash: Buffer.from(header.data_hash, 'hex')
    }, 'der');
    return sha.sha256(output);
}
