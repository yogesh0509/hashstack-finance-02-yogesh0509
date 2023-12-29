require('dotenv').config()

const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const ethers = require('ethers')

const transfer = require("../models/transferModel")
const approve = require("../models/approveModel")
const abi = require("../../constants/abi")

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC_URL)
const address1 = "0x13B97ca2361C4649eB254d4d5c2baa89fF3c96a6"
const address2 = "0x74AfD47aE0Cf11826d8c0F5B4c9f7868c76189aC"
const contract1 = new ethers.Contract(address1, abi["erc20"], provider)
const contract2 = new ethers.Contract(address2, abi["erc20"], provider)

contract1.on('Transfer', (from, to, value, event) => {
    console.log('Transfer Event:', {
        from,
        to,
        value: value.toString(),
        transactionHash: event.transactionHash,
    })
    const Transfer = new transfer
    Transfer._id = new mongoose.Types.ObjectId()
    Transfer.address = address1
    Transfer.amount = value.toString()
    Transfer.to = to
    Transfer.from = from

    Transfer.save()
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
})

contract2.on('Transfer', (from, to, value, event) => {
    console.log('Transfer Event:', {
        from,
        to,
        value: value.toString(),
        transactionHash: event.transactionHash,
    })
    const Transfer = new transfer
    Transfer._id = new mongoose.Types.ObjectId()
    Transfer.address = address2
    Transfer.amount = value.toString()
    Transfer.to = to
    Transfer.from = from

    Transfer.save()
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
})

contract1.on('Approval', (owner, spender, event) => {
    console.log('Approval Event:', {
        owner,
        spender,
        transactionHash: event.transactionHash,
    })
    const Approve = new approve
    Approve._id = new mongoose.Types.ObjectId()
    Approve.address = address1
    Approve.owner = owner
    Approve.spender = spender

    Approve.save()
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
})

contract2.on('Approval', (owner, spender, event) => {
    console.log('Approval Event:', {
        owner,
        spender,
        transactionHash: event.transactionHash,
    })
    const Approve = new approve
    Approve._id = new mongoose.Types.ObjectId()
    Approve.address = address2
    Approve.owner = owner
    Approve.spender = spender

    Approve.save()
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
})

router.get("/transfers/:contract_address",  (req, res, next) => {
    const contract_address = req.params.contract_address
    transfer.find({ address: contract_address })
        .exec()
        .then(data => {
            let total_amount = 0
            let total_transfers = 0
            let unique_add = []
            let total_unique_addresses = 0
            data.forEach(obj => {
                total_amount += parseInt(obj.amount)
                total_transfers++
                if(unique_add.indexOf(obj.to) == -1 || unique_add.indexOf(obj.from) == -1){
                    unique_add.push(obj.to)
                    unique_add.push(obj.from)
                    total_unique_addresses++
                }
            })
            res.status(200).json({
                total_amount: total_amount,
                total_transfers: total_transfers,
                total_unique_addresses: total_unique_addresses
            })
        })
})


router.get("/approvals/:contract_address",  (req, res, next) => {
    const contract_address = req.params.contract_address
    approve.find({ address: contract_address })
        .exec()
        .then(data => {
            let total_approvals = 0
            data.forEach(obj => {
                total_approvals++
            })
            res.status(200).json({
                approvals: total_approvals,
                contract_address : contract_address
            })
        })
})

router.get("/activity/:contract_address",  (req, res, next) => {
    const contract_address = req.params.contract_address
    transfer.find({ address: contract_address })
        .exec()
        .then(data => {
            const currentDate = new Date()
            let latest_ten = 0
            let prev_ten = 0
            data.forEach(obj => {
                if(obj.createdAt){
                    const timestamp = new Date(obj.createdAt)
                    const timeDifferenceMs = currentDate - timestamp
                    const timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60))
                    if(timeDifferenceMinutes < 10){latest_ten++}
                    else if(timeDifferenceMinutes >= 10 && timeDifferenceMinutes < 20){prev_ten++}
                }
            })
            const percentageChange = ((latest_ten - prev_ten) / prev_ten) * 100
            res.status(200).json({
                approvals: `${percentageChange} %`,
                contract_address : contract_address
            })
        })
})

module.exports = router